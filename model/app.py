import pandas as pd
import numpy as np
import pickle
from sklearn.tree import DecisionTreeRegressor
from flask import Flask
from flask import request

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


app = Flask(__name__)


@app.route('/', methods=['POST'])
def get_covid_score():
    X = np.zeros((1, len(my_column_names)))
    for ind in range(len(my_column_names)):
        X[0][ind] = request.json[my_column_names[ind]]

    X = pd.DataFrame(X, columns=column_names)
    death_prob = get_score('reg.sav', X)
    return {
        "death_prob": death_prob[0]
    }
