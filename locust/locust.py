from locust import HttpUser, task, between
from requests.auth import HTTPBasicAuth

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    
    @task
    def load_test(self):
        self.client.get("/", auth=HTTPBasicAuth("planet_user", "FI4Y$HJVZP"))
