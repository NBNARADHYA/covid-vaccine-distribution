import random
import pandas as pd
import numpy as np
import pickle
from sklearn.tree import DecisionTreeRegressor
from fastapi import FastAPI
from pydantic import BaseModel
import json
import sys
import nltk
from tensorflow.keras.models import load_model
from nltk.stem import WordNetLemmatizer
from fastapi.middleware.cors import CORSMiddleware

lemmatizer = WordNetLemmatizer()
nltk.download("punkt")
nltk.download("wordnet")

nlpModel = load_model("chatbot_model.h5")
intents = json.loads(open("intents.json").read())
words = pickle.load(open("words.pkl", "rb"))
classes = pickle.load(open("classes.pkl", "rb"))
class PatientDetails(BaseModel):
    sex: int
    patientType: int
    intubed: int
    pneumonia: int
    pregnancy: int
    diabetes: int
    copd: int
    asthma: int
    inmsupr: int
    hypertension: int
    otherDisease: int
    cardiovascular: int
    obesity: int
    renalChronic: int
    tobacco: int
    contactOtherCovid: int
    covidTestResult: int
    icu: int
    ageBand: int
    deltaDate: int

class Message(BaseModel):
    msg: str

column_names = ['sex', 'patient_type', 'intubed', 'pneumonia', 'pregnancy',
                'diabetes', 'copd', 'asthma', 'inmsupr', 'hypertension',
                'other_disease', 'cardiovascular', 'obesity', 'renal_chronic',
                'tobacco', 'contact_other_covid', 'Test result', 'icu', 'Age band',
                'delta']

my_column_names = ['sex', 'patientType', 'intubed', 'pneumonia', 'pregnancy',
                   'diabetes', 'copd', 'asthma', 'inmsupr', 'hypertension',
                   'otherDisease', 'cardiovascular', 'obesity', 'renalChronic',
                   'tobacco', 'contactOtherCovid', 'covidTestResult', 'icu', 'ageBand',
                   'deltaDate']


def get_score(filename, X):
    model = pickle.load(open(filename, 'rb'))
    score = model.predict(X)
    return score

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words

# return bag of words array: 0 or 1 for each word in the bag that exists in the sentence
def bow(sentence, words, show_details=True):
    # tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    # bag of words - matrix of N words, vocabulary matrix
    bag = [0] * len(words)
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                # assign 1 if current word is in the vocabulary position
                bag[i] = 1
                if show_details:
                    print("found in bag: %s" % w)
    return np.array(bag)


def predict_class(sentence, model):
    # filter out predictions below a threshold
    p = bow(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    # sort by strength of probability
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    return return_list


def getResponse(ints, intents_json):
    tag = ints[0]["intent"]
    list_of_intents = intents_json["intents"]
    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i["responses"])
            break
    return result

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/score/")
async def get_covid_score(inputs: PatientDetails):
    X = np.zeros((1, len(my_column_names)))

    for ind in range(len(my_column_names)):
        X[0][ind] = getattr(inputs, my_column_names[ind])

    X = pd.DataFrame(X, columns=column_names)

    death_prob = get_score('reg.sav', X)

    return {
        "death_prob": death_prob[0]
    }

@app.post("/bot/")
async def get_bot_response(req: Message):
    msg=getattr(req, 'msg')
    # checks is a user has given a name, in order to give a personalized feedback
    if msg.startswith('my name is'):
        name = msg[11:]
        ints = predict_class(msg, nlpModel)
        res1 = getResponse(ints, intents)
        res =res1.replace("{n}",name)
    elif msg.startswith('hi my name is'):
        name = msg[14:]
        ints = predict_class(msg, nlpModel)
        res1 = getResponse(ints, intents)
        res =res1.replace("{n}",name)
    #if no name is passed execute normally
    else:
        ints = predict_class(msg, nlpModel)
        res = getResponse(ints, intents)
    return {
        "response": res
    }