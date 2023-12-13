from django.shortcuts import render
from django.http import HttpResponse
from .models import Singers,Songs
import json
from django.forms.models import model_to_dict


# Create your views here.

def index(request):
    return render(request, "MusiQuizApp\index.html")

def game_choice(request):
    return render(request, "MusiQuizApp\game_choice.html")

def teams(request):
    return render(request, "MusiQuizApp/teams.html")

def classic(request):
    return render(request,"MusiQuizApp/classic.html")

def team_game(request):
    time = int(request.POST["time"])
    number_teams = int(request.POST["numberteams"])
    singers = [model_to_dict(x) for x in Singers.objects.all()] #Turn the QuerySet into a dict
    singers_names_faces = {}
    for dict in singers:
        singers_names_faces[dict["name"]] = dict["face"].url
    songssingers = [model_to_dict(x) for x in Songs.objects.all()]
    songs = []
    songs_singers = {}
    songs_samples = {}
    for dict in songssingers:
        songs.append(dict["name"])
        songs_samples[dict["name"]] = dict["sample"].url
        for dict2 in singers:
            if dict["singer"] == dict2["id"]:
                try: 
                    songs_singers[dict2["name"]].append(dict["name"])
                except KeyError:
                    songs_singers[dict2["name"]] = [dict["name"]]
    return render(request, "MusiQuizApp/team_game.html", {
        "time" : time,
        "number_teams" : number_teams,
        "songs" : songs,
        "songs_singers" : songs_singers,
        "singers_names_faces" : singers_names_faces,
        "songs_samples" : songs_samples
    })

def classic_game(request):
    time = int(request.POST["time"])
    number_turns = int(request.POST["numberturns"])
    singers = [model_to_dict(x) for x in Singers.objects.all()] #Turn the QuerySet into a dict
    singers_names_faces = {}
    for dict in singers:
        singers_names_faces[dict["name"]] = dict["face"].url
    songssingers = [model_to_dict(x) for x in Songs.objects.all()]
    songs = []
    songs_singers = {}
    songs_samples = {}
    for dict in songssingers:
        songs.append(dict["name"])
        songs_samples[dict["name"]] = dict["sample"].url
        for dict2 in singers:
            if dict["singer"] == dict2["id"]:
                try: 
                    songs_singers[dict2["name"]].append(dict["name"])
                except KeyError:
                    songs_singers[dict2["name"]] = [dict["name"]]
    return render(request, "MusiQuizApp/classic_game.html", {
        "time" : time,
        "number_turns" : number_turns,
        "songs" : songs,
        "songs_singers" : songs_singers,
        "singers_names_faces" : singers_names_faces,
        "songs_samples" : songs_samples
    })

def end_game(request, resultstring):
    if resultstring != "round": #Teams game
        list_result = []
        resultlist = resultstring.split("+")
        resultlist.pop(0) #Because string is of type "+score1+score2...", the first + is going to create a first element '' when we use the .split() method
        for result in resultlist:
            list_result.append(int(result))
        max_list = [i for i,score in enumerate(list_result) if score == max(list_result)]
        if len(max_list) > 1: #Then we have a draw
            winners = [i+1 for i in max_list]
            return render(request, "MusiQuizApp/end_game.html", {
                "end_sentence" : f"C'est une égalité ! Les Equipes  {winners}  gagnent la partie ! Bravo !"
            })
        max_score = max(list_result)
        winner = list_result.index(max_score) + 1 #Results are given in team order. So the winning team is the team with index(max_score) +1 (because the list is indexed at 0 but the teams are indexed at 1). f"L'Equipe  {winner}  gagne la partie ! Bravo !"
        return render(request, "MusiQuizApp/end_game.html", {
            "end_sentence" : f"L'Equipe  {winner}  gagne la partie ! Bravo !"
        })
    return render(request, "MusiQuizApp/end_game.html", {
            "end_sentence" : "Fin de la partie! Bravo à tous !"
        })