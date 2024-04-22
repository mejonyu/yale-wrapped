from flask import Blueprint, render_template, url_for, redirect, request, session

import time
import spotipy
from spotipy.oauth2 import SpotifyOAuth

views = Blueprint(__name__, "views")

# set the key for the token info in the session dictionary
TOKEN_INFO = 'token_info'

# handle login
@views.route("/")
def login():
    # auth_url = create_spotify_oauth().get_authorize_url()
    # # redirect to auth URL
    # return redirect(auth_url)
    session[TOKEN_INFO] = {
        'access_token': 'BQBGmg81tC8b-a4FKwUotzsNWN75z2pWtIeF4CE_F1ZSK9ezF4Gj0LoFCLLphvC86Fhh_szh7lfMrKS6l6MsCUq4rWjLSO6DUptPDSS9i12E4mnLurHoWd5Gh20eKjaMEMej-rZmx6C_ey5-FsUTPkYRwh7rDyJ4s9sXdJili7iLaZl_DQn4LBtGLDy9AHlhIv_3FdBSfA2XnYsIJ-Oc0by2PlfVP_gC_KUwv-SZcLwoK4xV6PBAYA',
        'expires_at': 1713752485,
        'expires_in': 3600,
        'refresh_token': 'AQDq7ZdxaLrApwun45Le6OJAPRizMN0G3pQVDB5DkJHZpw14js4QHAEOtBF1CJhFSNNpXidJcP8PbWOQIZnmXsrJqqYbChArNOmDIJiyQ90DU4WfGP_MdGdaVYFZwhfHA-I', 'scope': 'user-library-read playlist-modify-public playlist-modify-private', 'token_type': 'Bearer'
    }
    return redirect(url_for('views.search_page', _external=True))

@views.route("/redirect")
def redirect_page():
    session.clear()
    # get auth code from request params
    code = request.args.get('code')

    # access and refresh tokens
    token_info = create_spotify_oauth().get_access_token(code)
    # save the token info in session
    session[TOKEN_INFO] = token_info
    return redirect(url_for('views.search_page', _external=True))

@views.route("/search_page")
def search_page():
    return render_template("search.html")

@views.route("/add_song_to_playlist")
def add_song_to_playlist():
    try: 
        # get the token info from the session
        token_info = get_token()
    except:
        # if the token info is not found, redirect the user to the login route
        print('User not logged in')
        return redirect(url_for('views.login', _external=True))

    # create a Spotipy instance with the access token
    sp = spotipy.Spotify(auth=token_info['access_token'])
    curr_user_info = sp.me()

    args = request.args
    song_title = args.get("song")

    # get the user's playlists
    playlists =  sp.current_user_playlists()["items"]
    playlist_id = None

    # find our playlist if created
    for p in playlists:
        if(p["name"] == "CPSC 484 Songs"):
            playlist_id = p["id"]
            break
    
    # create playlist if not found
    if not playlist_id:
        p = sp.user_playlist_create(user = sp.me()["id"], name = "CPSC 484 Songs")
        playlist_id = p["id"]
    print(sp.search(song_title, limit=1, type="track")["tracks"]["items"][0])
    # add new song to the playlist
    sp.playlist_add_items(playlist_id = playlist_id, items = [sp.search(song_title, limit=1, type="track")["tracks"]["items"][0]["uri"]])
    return redirect(url_for('views.profile_page', _external=True))

@views.route("/profile_page")
def profile_page():
    try: 
        # get the token info from the session
        token_info = get_token()
    except:
        # if the token info is not found, redirect the user to the login route
        print('User not logged in')
        return redirect(url_for('views.login', _external=True))

    # create a Spotipy instance with the access token
    sp = spotipy.Spotify(auth=token_info['access_token'])
    curr_user_info = sp.me()
    
    return render_template("profile_page.html", 
        display_name = curr_user_info["display_name"],
        id = curr_user_info["id"],
        uri = curr_user_info["uri"],
        url = curr_user_info["external_urls"]["spotify"],
        image = curr_user_info["images"][1]["url"]
        )

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id = "90b2898c5e57448db258e1be673ea7b5",
        client_secret = "5a58c52be6604043b7db83785da05637",
        redirect_uri = url_for('views.redirect_page', _external=True),
        scope = "user-library-read playlist-modify-public playlist-modify-private"
    )

def get_token():
    token_info = session.get(TOKEN_INFO, None)
    if not token_info:
        # if the token info is not found, redirect the user to the login route
        redirect(url_for('views.login', _external=False))

    # check if the token is expired and refresh it if necessary
    curr = int(time.time())

    is_expired = token_info['expires_at'] - curr < 6000
    if(is_expired):
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.refresh_access_token(token_info['refresh_token'])

    return token_info

# @views.route("/")
# def home():
#     return render_template("index.html")