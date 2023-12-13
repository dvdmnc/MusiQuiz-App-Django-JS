from django.urls import path
from . import views

urlpatterns = [
    path("",views.index, name ="index"),
    path("game_choice", views.game_choice, name="game_choice"),
    path("teams", views.teams, name="teams"),
    path("classic", views.classic, name="classic"),
    path("team_game", views.team_game, name="team_game"),
    path("classic_game", views.classic_game, name="classic_game"),
    path("end_game/<str:resultstring>", views.end_game, name="end_game"),
]