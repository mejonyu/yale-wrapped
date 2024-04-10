from flask import Blueprint, render_template, url_for, redirect, request, session

import spotipy
from spotipy.oauth2 import SpotifyOAuth

views = Blueprint(__name__, "views")

# set the key for the token info in the session dictionary
TOKEN_INFO = 'token_info'

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = "90b2898c5e57448db258e1be673ea7b5",
        client_secret = "5a58c52be6604043b7db83785da05637",
        redirect_uri = url_for('views.redirect_page', _external=True),
        scope = "user-library-read playlist-modify-public playlist-modify-private"
    )

# handle login
@views.route("/")
def login():
    auth_url = create_spotify_oauth().get_authorize_url()
    # redirect to auth URL
    return redirect(auth_url)

@views.route("/redirect")
def redirect_page():
    pass


# @views.route("/")
# def home():
#     return render_template("index.html")