export const steps = [
  {
    label: "General questions",
    fields: [
      {
        name: "age",
        message: "What is your age ?",
      },
      {
        name: "sex",
        message: "Are you male or female ?",
        options: ["Female", "Male"],
      },
      {
        name: "icu",
        message: "Are you in ICU ?",
        options: ["No", "Yes"],
      },
      {
        name: "pregnancy",
        message: "Are your pregnant ?",
        options: ["No", "Yes"],
      },
      {
        name: "tobacco",
        message: "Do you consume tobacco ?",
        options: ["No", "Yes"],
      },
      { name: "obesity", message: "Are you obese ?", options: ["No", "Yes"] },
    ],
    initialValues: {
      age: "",
      icu: "",
      obesity: "",
      pregnancy: "",
      sex: "",
      tobacco: "",
    },
  },
  {
    label: "Medical details/history",
    fields: [
      {
        name: "intubed",
        message: "Have you ever been / Are you intubed ?",
        options: ["No", "Yes"],
      },
      {
        name: "pneumonia",
        message: "Have you ever had Pneumonia ?",
        options: ["No", "Yes"],
      },
      {
        name: "diabetes",
        message: "Have you ever had Diabetes ?",
        options: ["No", "Yes"],
      },
      {
        name: "copd",
        message:
          "Have you ever had COPD (Chronic obstructive pulmonary disease) ?",
        options: ["No", "Yes"],
      },
      {
        name: "asthma",
        message: "Have you ever had Asthma ?",
        options: ["No", "Yes"],
      },
      {
        name: "inmsupr",
        message: "Have you ever had Immunosuppression ?",
        options: ["No", "Yes"],
      },
      {
        name: "hypertension",
        message: "Have you ever had Hypertension ?",
        options: ["No", "Yes"],
      },
      {
        name: "cardiovascular",
        message: "Have you ever had Cardiovascular problems / disease ?",
        options: ["No", "Yes"],
      },
      {
        name: "renalChronic",
        message: "Have you ever had Chronic kidney disease ?",
        options: ["No", "Yes"],
      },
      {
        name: "otherDisease",
        message: "Have you ever had any other disease ?",
        options: ["No", "Yes"],
      },
    ],
    initialValues: {
      asthma: "",
      cardiovascular: "",
      copd: "",
      diabetes: "",
      hypertension: "",
      inmsupr: "",
      intubed: "",
      otherDisease: "",
      pneumonia: "",
      renalChronic: "",
    },
  },
  {
    label: "Covid specific questions",
    fields: [
      {
        name: "contactOtherCovid",
        message: "Have you had contact with other covid positive folks ?",
        options: ["No", "Yes"],
      },
      {
        name: "covidTestResult",
        message: "What is your covid test result ?",
        options: [
          "Negative",
          "Positive",
          "Waiting for test results / have not given test",
        ],
      },
      {
        name: "patientType",
        message: "Are you an outpatient or an inpatient ?",
        options: ["Outpatient", "Inpatient"],
      },
      { name: "dateSymptoms", message: "Date since covid symptoms" },
    ],
    initialValues: {
      contactOtherCovid: "",
      dateSymptoms: new Date(),
      covidTestResult: "",
      patientType: "",
    },
  },
];
