import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const formatDate = (): string => {
  const d = new Date();
  let month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
};

@Entity()
export class PatientProfile {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  sex: 1 | 0;

  @Column()
  patientType: 1 | 2;

  @Column({ default: formatDate() })
  entryDate: string;

  @Column()
  dateSymptoms: string;

  @Column({ default: "9999-99-99" })
  dateDied: string;

  @Column({ nullable: true })
  deltaDate: number;

  @Column()
  intubed: 1 | 0;

  @Column()
  pneumonia: 1 | 0;

  @Column()
  ageBand: number;

  @Column()
  pregnancy: 1 | 0;

  @Column()
  diabetes: 1 | 0;

  @Column()
  copd: 1 | 0;

  @Column()
  asthma: 1 | 0;

  @Column()
  inmsupr: 1 | 0;

  @Column()
  hypertension: 1 | 0;

  @Column()
  otherDisease: 1 | 0;

  @Column()
  cardiovascular: 1 | 0;

  @Column()
  obesity: 1 | 0;

  @Column()
  renalChronic: 1 | 0;

  @Column()
  tobacco: 1 | 0;

  @Column()
  contactOtherCovid: 1 | 0;

  @Column({ nullable: true })
  covidTestResult: 0 | 1 | 2;

  @Column()
  icu: 1 | 0;
}
