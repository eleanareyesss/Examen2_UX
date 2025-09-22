import logo from './logo.svg';
import './App.css';
import axiosInstance from './api/axiosInstance';
function App() {
  const testApiCall = async () => {
    try {
      const response = await axiosInstance.get('/test');
      console.log('API Response:', response.data);
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  testApiCall();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
