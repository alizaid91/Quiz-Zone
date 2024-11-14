import Hero from './Hero'
import Categegories from './Categories'
import Newsletter from '../Newsletter/Newsletter'

function Home() {
  return (
    <div className='scroll-smooth'>
      <Hero />
      <Categegories />
      <Newsletter />
    </div>
  )
}

export default Home