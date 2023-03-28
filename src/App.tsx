import { Button } from 'antd';
import styled from 'styled-components';
import { useSpring, animated } from '@react-spring/web'
import './App.less';

function App() {
  const [style, api] = useSpring(() => ({
    from: { x: 0 },
    to: { x: 100 },
  }));
  return (
    <div className="App">
      hello world
      <animated.div style={style}>
        <Mybutton type='primary'>111</Mybutton>
      </animated.div>
    </div>
  );
}

export default App;

const Mybutton = styled(Button)`
  font-size: 32px;
  font-weight: 600;
  width: 100px;
  height: 50px;
`;
