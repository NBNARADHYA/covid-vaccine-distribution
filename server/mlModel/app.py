import pandas as pd
import numpy as np
import pickle
from sklearn.tree import DecisionTreeRegressor
import json
import sys

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


def get_covid_score(inputs):
    X = np.zeros((1, len(my_column_names)))

    for ind in range(len(my_column_names)):
        X[0][ind] = inputs[my_column_names[ind]]

    X = pd.DataFrame(X, columns=column_names)

    death_prob = get_score('mlModel/reg.sav', X)

    return death_prob[0]


if __name__ == "__main__":
    input_string = sys.argv[1]

    if input_string == "":
        print(2)
    else:
        inputs = json.loads(input_string)
        print(get_covid_score(inputs))
