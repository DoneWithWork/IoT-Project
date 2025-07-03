import { DataStream } from "@repo/db";
import { unstable_cache } from "next/cache";
import { db } from "@repo/db";
import { ApiKeyExtend, CachedDeviceType, DevicesByProjectType, ProjectTypeData } from "./types";



export async function getCachedDevice({ deviceId, userId }: CachedDeviceType) {
    return unstable_cache(async () => GetDevice({ userId, deviceId }), ["device", deviceId], {
        revalidate: false,
        tags: [`device:${deviceId}`]
    }
    )()
}
export async function getCachedDevicesByProject({ userId, projectId }: DevicesByProjectType) {
    return unstable_cache(async () => GetDevicesByProject({ userId, projectId }), ["project_devices", projectId], {
        revalidate: false,
        tags: [`project_devices:${userId}:${projectId}`]
    }
    )()
}

export async function GetDevice({ userId, deviceId }: CachedDeviceType) {
    const device = await db.device.findFirst({
        where: {
            id: deviceId,
            Project: {
                userId: userId
            }
        }
    })
    return device
}
export async function GetDevices(userId: string) {
    const device = await db.device.findMany({
        where: {
            Project: {
                userId: userId
            }
        }
    })
    return device
}
export async function getCachedDevices(userId: string) {
    console.log("Devices")
    return unstable_cache(async () => GetDevices(userId), ["devices", userId], {
        revalidate: false,
        tags: [`devices:${userId}`]
    }
    )()
}

export async function GetDevicesByProject({ userId, projectId }: DevicesByProjectType) {
    const devices = await db.device.findMany({
        where: {
            Project: {
                id: projectId,
                userId: userId
            }
        }
    })
    return devices
}
export async function GetProject({ userId, projectId }: ProjectTypeData) {
    const project = await db.project.findFirst({
        where: {
            id: projectId,
            userId: userId
        }
    })
    return project
}
export async function GetProjects(userId: string) {
    const projects = await db.project.findMany({
        where: {
            userId: userId
        }
    })
    return projects
}
export async function getCachedProjects(userId: string) {
    console.log("Projects")
    return unstable_cache(async () => GetProjects(userId), ["projects", userId], {
        revalidate: false,
        tags: [`projects:${userId}`]
    }
    )()
}

export async function getCachedProject({ userId, projectId }: ProjectTypeData) {
    console.log("Project")
    return unstable_cache(async () => GetProject({ userId, projectId }), ["project", userId], {
        revalidate: false,
        tags: [`project:${userId}:${projectId}`]
    }
    )()
}
export async function GetApiKeys(userId: string) {
    const apiKeys = await db.apiKey.findMany({
        where: {
            userId: userId
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            initial: true,
            type: true
        }

    })
    return apiKeys as ApiKeyExtend[];
}

export async function getCachedApiKeys(userId: string) {
    return unstable_cache(async () => GetApiKeys(userId), ["api_keys", userId], {
        revalidate: false,
        tags: [`api_keys:${userId}`]
    }
    )()
}
export async function GetDataStreams({ userId, projectId }: ProjectTypeData) {
    const project = await db.project.findFirst({
        where: {
            userId,
            id: projectId
        }
    })
    if (!project) return []
    const devices = await db.device.findMany({
        where: {
            projectId,
        },
        select: {
            dataStreams: true
        }
    })
    if (!devices) return []
    const dataStreams: DataStream[] = devices.flatMap((device) => device.dataStreams)

    return dataStreams
}
export async function getCachedDataStreamsProject({ userId, projectId }: ProjectTypeData) {
    return unstable_cache(async () => GetDataStreams({ userId, projectId }), ["dataStreams", userId, projectId], {
        revalidate: false,
        tags: [`data_stream:${userId}:${projectId}`]
    }
    )()
}
export async function GetAllUsers() {
    const users = await db.user.findMany()
    return users;
}
export async function getCachedUsers() {
    return unstable_cache(async () => GetAllUsers(), ["users"], {
        revalidate: false,
        tags: [`admin:users`]
    }
    )()
}
export async function GetUserAdmin(userId: string) {
    const user = await db.user.findFirst({
        where: {
            id: userId

        },
        include: {
            projects: {
                include: {
                    devices: {
                        include: {
                            dataStreams: true
                        }
                    }
                }
            }
        }
    })
    return user
}
export async function getCachedUser(userId: string) {
    return unstable_cache(async () => GetUserAdmin(userId), ["user", userId], {
        revalidate: false,
        tags: [`admin:user:${userId}`]
    }
    )()
}