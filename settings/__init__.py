import os
from base import *

ENVIRONMENT = os.getenv("DJANGO_ENVIRONMENT")

if ENVIRONMENT == "live":
    from live import *
elif ENVIRONMENT == "local":
    from local import *
elif ENVIRONMENT == "qa":
    from qa import *

