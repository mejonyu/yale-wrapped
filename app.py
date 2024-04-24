from flask import Flask
from views import views

app = Flask(__name__)

# set the name of the session cookie
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'

# set a random secret key to sign the cookie
app.secret_key = 'jfea849ap(*&*^$3)890$'

app.register_blueprint(views, url_prefix="/")

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5017)