import { ApiKey } from "@repo/db";

export type ProjectType = {
    title: string;
    description: string;
    id: string;
};
export type ApiKeyType = {
    name: string;
    initial: string;
    key: string;
    type: string;
    createdAt: string;
}
export type DevicesType = {
    id: string;
    name: string;
    description: string;
    projectId: string;
    createdAt: string;
    deviceAuthToken: string;
}
export type DataStreamType = {
    id: string;
    deviceId: string;
    title: string;

    description: string;
    createdAt: string;
}
export type ApiKeyExtend = Omit<ApiKey, "key">;

export type CachedDeviceType = {
    deviceId: string;
    userId: string;
}

export type DevicesByProjectType = {
    userId: string;
    projectId: string;

}
export type ProjectTypeData = DevicesByProjectType