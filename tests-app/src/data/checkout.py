from dataclasses import dataclass


@dataclass(frozen=True)
class PersonalInfo:
    first_name: str
    last_name: str
    postal_code: str


DEFAULT_PERSONAL_INFO = PersonalInfo('QA', 'Automation', '12345')
