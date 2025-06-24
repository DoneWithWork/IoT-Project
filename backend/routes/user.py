from typing import List

from database.db import db
from fastapi import APIRouter, Depends, HTTPException
from libs.api_key_management import generate_api_key, store_api_key
from prisma.enums import ApiKeyType, DeviceType
from prisma.models import ApiKey, Project
from pydantic import BaseModel
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

userRouter = APIRouter(prefix="/api/user", tags=["User"])


class NewProjectType(BaseModel):
    title: str
    description: str


class NewApiKey(BaseModel):
    name: str
    type: ApiKeyType


class NewDeviceType(BaseModel):
    name: str
    description: str
    deviceType: DeviceType
    projectId: str


class NewDataStreamType(BaseModel):
    deviceId: str
    title: str
    description: str


@userRouter.post("/new-project", status_code=201)
async def new_project(
    newProject: NewProjectType, session: SessionContainer = Depends(verify_session())
):
    userId = session.get_user_id()

    project: Project = await db.project.create(
        data={
            "title": newProject.title,
            "description": newProject.description,
            "userId": userId,
        }
    )
    return {"id": project.id}


@userRouter.get("/projects", status_code=200)
async def projects(session: SessionContainer = Depends(verify_session())):
    userId = session.get_user_id()

    projects: List[Project] = await db.project.find_many(where={"userId": userId})

    return {"projects": projects}


@userRouter.get("/project/{id}", status_code=200)
async def project(id: str, session: SessionContainer = Depends(verify_session())):
    userId = session.get_user_id()

    project: Project = await db.project.find_first(
        where={"AND": [{"id": id}, {"userId": userId}]}
    )

    return {"project": project}


@userRouter.delete("/delete-project")
async def delete_project():
    pass


@userRouter.get("/api-keys", status_code=200)
async def api_keys(session: SessionContainer = Depends(verify_session())):
    userId = session.get_user_id()

    api_keys: List[ApiKey] = await db.apikey.find_many(where={"userId": userId})

    return {"api_keys": api_keys}


@userRouter.post("/new-api-key", status_code=201)
async def new_api_key(
    newApiKey: NewApiKey, session: SessionContainer = Depends(verify_session())
):
    userId = session.get_user_id()

    # Generate 16 bytes to use for base key
    key = await generate_api_key()
    status = await store_api_key(userId, key, newApiKey.type, newApiKey.name)
    if not status:
        raise HTTPException(status_code=500, detail="Failed to create api key")

    return {"message": "Successfully created API KEY"}


@userRouter.post("/new-device", status_code=201)
async def new_device(
    newDevice: NewDeviceType, session: SessionContainer = Depends(verify_session())
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")
    project = await db.project.find_first(where={"id": newDevice.projectId})

    if project.userId != userId:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        newDevice = await db.device.create(
            data={
                "name": newDevice.name,
                "description": newDevice.description,
                "deviceType": newDevice.deviceType,
                "projectId": newDevice.projectId,
                "deviceAuthToken": (project.title).lower().replace(" ", "_")
                + "_"
                + await generate_api_key(),
            }
        )
        return {"new_device": newDevice}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.get("/devices", status_code=200)
async def devices(session: SessionContainer = Depends(verify_session())):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")

    try:
        devices = await db.device.find_many(where={"Project": {"userId": userId}})
        return {"devices": devices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.get("/devices/{projectId}", status_code=200)
async def devices_for_project(
    projectId: str, session: SessionContainer = Depends(verify_session())
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")

    try:
        devices = await db.device.find_many(
            where={"Project": {"AND": [{"userId": userId}, {"id": projectId}]}}
        )
        return {f"devices_for_project_{projectId}": devices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.get("/device/{project_id}/{device_id}", status_code=200)
async def device(
    project_id: str,
    device_id: str,
    session: SessionContainer = Depends(verify_session()),
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")

    try:
        device = await db.device.find_first(
            where={
                "AND": [
                    {"projectId": project_id},
                    {"id": device_id},
                    {"Project": {"userId": userId}},
                ]
            }
        )
        if device is None:
            raise HTTPException(status_code=404, detail="Device not found")
        return {"device": device}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.post("/new-data-stream", status_code=201)
async def new_data_stream(
    new_data_stream: NewDataStreamType,
    session: SessionContainer = Depends(verify_session()),
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")
    try:
        device = await db.device.find_first(
            where={"id": (new_data_stream.deviceId)}, include={"Project": True}
        )
        if device is None or device.Project is None or device.Project.userId != userId:
            raise HTTPException(status_code=403, detail="Forbidden")
        newDataStream = await db.datastream.create(
            data={
                "title": new_data_stream.title,
                "description": new_data_stream.description,
                "deviceId": new_data_stream.deviceId,
            }
        )
        return {"new_data_stream": newDataStream}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.delete("/delete-data-stream/{dataStreamId}/{deviceId}", status_code=201)
async def delete_data_stream(
    dataStreamId: str,
    deviceId: str,
    session: SessionContainer = Depends(verify_session()),
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")

    # Find the top level device
    device = await db.device.find_unique(
        where={"id": (deviceId)}, include={"Project": True}
    )

    # Ensure integrity and authorization by proper user
    if device is None or device.Project is None or device.Project.userId != userId:
        raise HTTPException(status_code=403, detail="Forbidden")
    try:
        await db.datastream.delete(where={"id": int(dataStreamId)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@userRouter.get("/data-streams/{project_id}", status_code=200)
async def get_data_stream(
    project_id: str, session: SessionContainer = Depends(verify_session())
):
    userId = session.get_user_id()
    if userId is None:
        raise HTTPException(status_code=400, detail="Not allowed to access")
    try:
        project = await db.project.find_first(
            where={"AND": [{"id": project_id}, {"userId": userId}]}
        )

        if project is None or project.userId != userId:
            raise HTTPException(status_code=403, detail="Unauthorized")

        # Second: Get devices with dataStreams
        devices = await db.device.find_many(
            where={"projectId": project_id},
            include={"dataStreams": True},
        )

        # Flatten dataStreams
        all_streams = []
        for device in devices:
            all_streams.extend(device.dataStreams)
        return {f"data_streams_{project.id}": all_streams}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
