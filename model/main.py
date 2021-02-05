import pandas as pd
import numpy as np
import pickle
from sklearn.tree import DecisionTreeRegressor
from fastapi import FastAPI
from pydantic import BaseModel
import json
import sys


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


app = FastAPI()


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
