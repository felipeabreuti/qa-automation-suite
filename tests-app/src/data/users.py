from dataclasses import dataclass


@dataclass(frozen=True)
class Credentials:
    username: str
    password: str


STANDARD_USER = Credentials('standard_user', 'secret_sauce')
LOCKED_OUT_USER = Credentials('locked_out_user', 'secret_sauce')
