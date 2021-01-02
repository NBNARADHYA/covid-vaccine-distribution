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
  sex: 1 | 2;

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
  intubed: 1 | 2;

  @Column()
  pneumonia: 1 | 2;

  @Column()
  ageBand: number;

  @Column()
  pregnancy: 1 | 2;

  @Column()
  diabetes: 1 | 2;

  @Column()
  copd: 1 | 2;

  @Column()
  asthma: 1 | 2;

  @Column()
  inmsupr: 1 | 2;

  @Column()
  hypertension: 1 | 2;

  @Column()
  otherDisease: 1 | 2;

  @Column()
  cardiovascular: 1 | 2;

  @Column()
  obesity: 1 | 2;

  @Column()
  renalChronic: 1 | 2;

  @Column()
  tobacco: 1 | 2;

  @Column()
  contactOtherCovid: 1 | 2;

  @Column({ nullable: true })
  covidRes: 1 | 2 | 3;

  @Column()
  icu: 1 | 2;
}
