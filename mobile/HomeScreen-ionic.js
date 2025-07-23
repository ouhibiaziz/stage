// Deprecated: Ionic version removed.
export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [message, setMessage] = useState('');

  const validateSession = async () => {
    const token = await getToken();
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    try {
      // Optionally, you can decode token or call backend validate
      const text = await fetchHello();
      setMessage(text);
    } catch (e) {
      console.error(e);
      await clearToken();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  useEffect(() => {
    if (isFocused) {
      validateSession();
    }
  }, [isFocused]);

  return (
    <IonPage>
      <IonContent className="ion-padding" style={styles.container}>
        <div style={styles.contentWrapper}>
          <IonText>
            <h2 style={styles.text}>{message || 'Welcome!'}</h2>
          </IonText>
          
          <IonButton 
            expand="block"
            color="danger"
            style={styles.button}
            onClick={async () => {
              await clearToken();
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }}
          >
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}

const styles = StyleSheet.create({
  container: {
    '--background': '#f5f5f5', // Ionic CSS variable for background
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
});
