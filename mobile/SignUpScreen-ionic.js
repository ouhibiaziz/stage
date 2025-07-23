// Deprecated: Ionic version removed.
const SignUpScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: null,
  });
  const [errors, setErrors] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: '' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // --- Validation Logic ---
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    if (!formData.password) {
        newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (!formData.firstName) newErrors.firstName = 'First name is required.';
    if (!formData.lastName) newErrors.lastName = 'Last name is required.';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';

    setErrors(newErrors);
    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  // --- Form Submission ---
  const handleSignUp = async () => {
    if (!validateForm()) {
      setToast({ show: true, message: 'Please fix the errors before submitting.', color: 'danger' });
      return;
    }

    setShowLoading(true);
    try {
      // Hash the password before sending it to the backend
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(formData.password, salt);

      // Format the data for the backend API
      const apiData = {
        username: formData.username,
        email: formData.email,
        passwordHash: passwordHash,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        // Format date to YYYY-MM-DD
        dateOfBirth: formData.dateOfBirth.split('T')[0],
      };

      await registerUser(apiData);
      setToast({ show: true, message: 'Sign up successful! Please log in.', color: 'success' });
      navigation.navigate('Login');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Sign up failed. Please try again.';
      setToast({ show: true, message: errorMessage, color: 'danger' });
    } finally {
      setShowLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setFormData({ ...formData, dateOfBirth: e.detail.value });
    setShowDatePicker(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="8" size-lg="6">
              {/* Form Inputs */}
              <IonInput label="Username" labelPlacement="floating" fill="outline" value={formData.username} onIonInput={(e) => setFormData({ ...formData, username: e.detail.value })} style={{ marginBottom: '10px' }} />
              {errors.username && <IonText color="danger"><p>{errors.username}</p></IonText>}

              <IonInput label="Email" type="email" labelPlacement="floating" fill="outline" value={formData.email} onIonInput={(e) => setFormData({ ...formData, email: e.detail.value })} style={{ marginTop: '10px' }} />
              {errors.email && <IonText color="danger"><p>{errors.email}</p></IonText>}

              <IonInput label="Password" type="password" labelPlacement="floating" fill="outline" value={formData.password} onIonInput={(e) => setFormData({ ...formData, password: e.detail.value })} style={{ marginTop: '10px' }} />
              {errors.password && <IonText color="danger"><p>{errors.password}</p></IonText>}
              
              <IonInput label="First Name" labelPlacement="floating" fill="outline" value={formData.firstName} onIonInput={(e) => setFormData({ ...formData, firstName: e.detail.value })} style={{ marginTop: '10px' }} />
              {errors.firstName && <IonText color="danger"><p>{errors.firstName}</p></IonText>}

              <IonInput label="Last Name" labelPlacement="floating" fill="outline" value={formData.lastName} onIonInput={(e) => setFormData({ ...formData, lastName: e.detail.value })} style={{ marginTop: '10px' }} />
              {errors.lastName && <IonText color="danger"><p>{errors.lastName}</p></IonText>}

              <IonInput label="Phone Number" type="tel" labelPlacement="floating" fill="outline" value={formData.phoneNumber} onIonInput={(e) => setFormData({ ...formData, phoneNumber: e.detail.value })} style={{ marginTop: '10px' }} />
              {errors.phoneNumber && <IonText color="danger"><p>{errors.phoneNumber}</p></IonText>}

              {/* Date of Birth Picker */}
              <IonItem fill="outline" style={{ marginTop: '10px' }} button onClick={() => setShowDatePicker(true)}>
                <IonLabel position="floating">Date of Birth</IonLabel>
                <IonText>{formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Select Date'}</IonText>
              </IonItem>
              {errors.dateOfBirth && <IonText color="danger"><p>{errors.dateOfBirth}</p></IonText>}
              
              <IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
                <IonDatetime presentation="date" onIonChange={handleDateChange} />
              </IonModal>

              <IonButton expand="block" onClick={handleSignUp} style={{ marginTop: '20px' }}>
                Sign Up
              </IonButton>
              <IonButton expand="block" fill="clear" onClick={() => navigation.navigate('Login')} style={{ marginTop: '10px' }}>
                Already have an account? Login
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* User Feedback */}
        <IonLoading isOpen={showLoading} message={'Creating account...'} />
        <IonToast isOpen={toast.show} message={toast.message} color={toast.color} duration={3000} onDidDismiss={() => setToast({ ...toast, show: false })} />
      </IonContent>
    </IonPage>
  );
};

export default SignUpScreen;
