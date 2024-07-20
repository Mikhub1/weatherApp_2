import { it, expect, describe } from 'vitest'
import Greet from '../../src/components/Greet'
import {render, screen} from '@testing-library/react'

describe('Greet', () => {
    it('Should render greeting',() =>{
       render(<Greet name = 'Mosh'/>)
    })
    
    screen.debug()
})