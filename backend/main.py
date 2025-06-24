import asyncio
from contextlib import asynccontextmanager
from typing import Union

import paho.mqtt.client as mqtt
from database.db import db
from fastapi import Depends, FastAPI
from libs.supertokens import setup_supertokens
from routes.user import userRouter
from starlette.middleware.cors import CORSMiddleware
from supertokens_python import (
    get_all_cors_headers,
)
from supertokens_python.framework.fastapi import get_middleware
from supertokens_python.recipe.session import SessionContainer
from supertokens_python.recipe.session.framework.fastapi import verify_session

setup_supertokens()


# Setup FastAPI stuff
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the ML model
    await db.connect()
    yield
    # Clean up the ML models and release the resources
    await db.disconnect()


app = FastAPI(lifespan=lifespan)

app.add_middleware(get_middleware())
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)

app.include_router(userRouter)


@app.post("/like_comment")
async def like_comment(session: SessionContainer = Depends(verify_session())):
    user_id = session.get_user_id()

    print(user_id)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.post("/new-project")
async def new_project():
    pass


# MQTT stuff
def on_connect(client, userdata, flags, reason_code, properties):
    print(f"Connected with result code {reason_code}")
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("$SYS/#")


# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic + " " + str(msg.payload))


# mqttc = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
# mqttc.on_connect = on_connect
# mqttc.on_message = on_message

# mqttc.connect("localhost", 1883, 60)

# # Blocking call that processes network traffic, dispatches callbacks and
# # handles reconnecting.
# # Other loop*() functions are available that give a threaded interface and a
# # manual interface.
# mqttc.loop_forever()
