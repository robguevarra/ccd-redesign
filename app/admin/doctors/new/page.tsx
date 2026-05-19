import { DoctorEditor } from '../doctor-editor';

export const metadata = {
  title: 'New doctor',
  robots: { index: false, follow: false },
};

export default function NewDoctorPage() {
  return <DoctorEditor />;
}
