import { PatientFormEditor } from '../form-editor';

export const metadata = {
  title: 'Upload patient form',
  robots: { index: false, follow: false },
};

export default function NewPatientFormPage() {
  return <PatientFormEditor />;
}
