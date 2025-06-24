import secrets

from database.db import db
from prisma.enums import ApiKeyType


async def generate_api_key(length=16) -> str:
    return secrets.token_urlsafe(length)


async def store_api_key(
    user_id: str, api_key: str, api_key_type: ApiKeyType, name: str
):
    """
    Safely storing a newly generated API key to the relevant user

    Parameters:
        user: User
        api_key: str

    """
    # hashed = bcrypt.hashpw(api_key.encode(), bcrypt.gensalt()).decode("utf-8")

    type: ApiKeyType = ApiKeyType[api_key_type]
    user = await db.user.find_first(where={"id": user_id})
    if user is None:
        return False
    async with db.tx() as transaction:
        await transaction.apikey.create(
            data={
                "name": name,
                "initial": api_key[:5],
                "userId": user.id,
                "key": api_key,
                "type": type,
            }
        )

    print("Successfully created API KEY")
    return True


async def delete_api_key(user_id: str, api_key):
    pass


async def compare_api_key(user_id: str, hashed_api_key: str) -> bool:
    await db.apikey.find_first(
        where={"AND": [{"key": hashed_api_key}, {"userId": user_id}]}
    )
