import '../css/App.css';
import Chat from './Chat';

function App() {
  return (
    <div className="App">
      <aside className="sidebar">
        <div className="chat-list">
        </div>
      </aside>
      <div className="main">
        <Chat />
      </div>
    </div>
  );
}

export default App;
