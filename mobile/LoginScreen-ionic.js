
const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', color: '' });

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setToast({ show: true, message: 'Email and password are required.', color: 'danger' });
      return;
    }

    setShowLoading(true);
    try {
      const response = await loginUser(email, password);
      // The API should return a token on successful login
      if (response && response.token) {
        setToast({ show: true, message: 'Login successful!', color: 'success' });
        // Reset navigation to the main part of the app, preventing users from going back to login
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        // Handle cases where the server responds but without a token
        throw new Error('Invalid login response from server');
      }
    } catch (error) {
      // Provide user-friendly error messages from the API or a generic one
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setToast({ show: true, message: errorMessage, color: 'danger' });
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12" size-md="6" size-lg="4">
              <IonInput
                label="Email"
                labelPlacement="floating"
                fill="outline"
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value)}
                style={{ marginBottom: '15px' }}
              />
              <IonInput
                label="Password"
                labelPlacement="floating"
                fill="outline"
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value)}
                style={{ marginBottom: '20px' }}
              />
              <IonButton expand="block" onClick={handleLogin}>
                Login
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                onClick={() => navigation.navigate('SignUp')}
                style={{ marginTop: '10px' }}
              >
                Don't have an account? Sign Up
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonLoading isOpen={showLoading} message={'Logging in...'} />
        <IonToast
          isOpen={toast.show}
          message={toast.message}
          color={toast.color}
          duration={3000}
          onDidDismiss={() => setToast({ show: false, message: '', color: '' })}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginScreen;
