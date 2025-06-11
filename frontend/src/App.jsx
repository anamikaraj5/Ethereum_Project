import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Addcourse from './pages/Addcourse'
import AddEducator from './pages/AddEducator'
import Home from './pages/Home'
import ViewAll from './pages/ViewAll';
import LearnMore from './pages/LearnMore'
import ViewRewards from './pages/ViewRewards';

function App() {

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addeducator" element={<AddEducator />} />
        <Route path='/viewallcourse' element={<ViewAll/>}/>
        <Route path='/addcourse' element={<Addcourse/>}/>
        <Route path="/learnmore/:id" element={<LearnMore />} />
        <Route path="/viewrewards" element={<ViewRewards />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
