from supertokens_python import (
    InputAppInfo,
    SupertokensConfig,
    init,
)
from supertokens_python.recipe import emailpassword, session, thirdparty
from supertokens_python.recipe.thirdparty.provider import (
    ProviderClientConfig,
    ProviderConfig,
    ProviderInput,
)
from supertokens_python.recipe.thirdparty.interfaces import (
    RecipeInterface,
    SignInUpOkResult,
)
from database.db import db
from supertokens_python.recipe import dashboard
from supertokens_python.recipe.thirdparty.types import RawUserInfoFromProvider
from typing import Dict, Any, Optional, Union
from supertokens_python.recipe.session.interfaces import SessionContainer
import os


def setup_supertokens():
    SUPERTOKENS_API_KEY = os.environ.get("SUPERTOKENS_API_KEY")
    SUPERTOKENS_URL = os.environ.get("SUPERTOKENS_URL")

    GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")

    GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")

    isDev = os.environ.get("RUN_MODE") == "dev"
    init(
        app_info=InputAppInfo(
            app_name="iot_project",
            api_domain=os.environ.get("DEV_BACKEND")
            if isDev
            else os.environ.get("PROD_BACKEND"),
            website_domain=os.environ.get("DEV_FRONTEND")
            if isDev
            else os.environ.get("PROD_FRONTEND"),
            api_base_path="/auth",
            website_base_path="/auth",
        ),
        supertokens_config=SupertokensConfig(
            # We use try.supertokens for demo purposes.
            # At the end of the tutorial we will show you how to create
            # your own SuperTokens core instance and then update your config.
            connection_uri=SUPERTOKENS_URL,
            api_key=SUPERTOKENS_API_KEY,
        ),
        framework="fastapi",
        recipe_list=[
            dashboard.init(),
            session.init(),  # initializes session features
            emailpassword.init(),
            thirdparty.init(
                override=thirdparty.InputOverrideConfig(
                    functions=override_thirdparty_functions
                ),
                sign_in_and_up_feature=thirdparty.SignInAndUpFeature(
                    providers=[
                        ProviderInput(
                            config=ProviderConfig(
                                third_party_id="google",
                                clients=[
                                    ProviderClientConfig(
                                        client_id=GOOGLE_CLIENT_ID,
                                        client_secret=GOOGLE_CLIENT_SECRET,
                                        scope=[
                                            "https://www.googleapis.com/auth/userinfo.email",
                                            "https://www.googleapis.com/auth/userinfo.profile",
                                        ],
                                    ),
                                ],
                            ),
                        ),
                        ProviderInput(
                            config=ProviderConfig(
                                third_party_id="github",
                                clients=[
                                    ProviderClientConfig(
                                        client_id=GITHUB_CLIENT_ID,
                                        client_secret=GITHUB_CLIENT_SECRET,
                                    )
                                ],
                            ),
                        ),
                    ]
                ),
            ),
        ],
        mode="asgi",  # use wsgi if you are running using gunicorn
    )


def override_thirdparty_functions(
    original_implementation: RecipeInterface,
) -> RecipeInterface:
    original_sign_in_up = original_implementation.sign_in_up

    async def sign_in_up(
        third_party_id: str,
        third_party_user_id: str,
        email: str,
        is_verified: bool,
        oauth_tokens: Dict[str, Any],
        raw_user_info_from_provider: RawUserInfoFromProvider,
        session: Optional[SessionContainer],
        should_try_linking_with_session_user: Union[bool, None],
        tenant_id: str,
        user_context: Dict[str, Any],
    ):
        result = await original_sign_in_up(
            third_party_id,
            third_party_user_id,
            email,
            is_verified,
            oauth_tokens,
            raw_user_info_from_provider,
            session,
            should_try_linking_with_session_user,
            tenant_id,
            user_context,
        )

        if isinstance(result, SignInUpOkResult):
            # user object contains the ID and email of the user
            userId = result.user.id

            # This is the response from the OAuth 2 provider that contains their tokens or user info.
            provider_access_token = result.oauth_tokens["access_token"]
            print(provider_access_token)
            user = result.raw_user_info_from_provider.from_user_info_api
            if result.raw_user_info_from_provider.from_user_info_api is not None:
                if session is None:
                    if (
                        result.created_new_recipe_user
                        and len(result.user.login_methods) == 1
                    ):
                        print("New user was created")
                        if third_party_id == "github":
                            username = user["login"]
                            email = user["emails"][0]["email"]
                            profile = user["avatar_url"]
                        else:
                            username = user["name"]
                            profile = user["picture"]
                            email = user["email"]
                        await db.user.create(
                            data={
                                "id": userId,
                                "username": username,
                                "email": email,
                                "profile": profile,
                            }
                        )
                    else:
                        print("User already existed and was signed in")
            else:
                raise ValueError("Failed auth")
        return result

    original_implementation.sign_in_up = sign_in_up

    return original_implementation
