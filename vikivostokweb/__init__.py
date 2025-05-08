# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
import os
os.environ.setdefault('FORKED_BY_MULTIPROCESSING', '1')

from vikivostokweb.celery import app as celery_app

__all__ = ('celery_app',)
