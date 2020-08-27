import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import { Auth } from '@/services/Auth'
import Login from '@/views/Login.vue'

describe('Login.vue', () => {
  it('Muestra error si login falla', async () => {
    const login = {
        message: 'Wrong user or password',
        status: 401
      
    } 
    sinon.stub(Auth, 'login').rejects(login)
    const wrapper = shallowMount(Login)
    wrapper.setData({
      credentials: {
        email: 'hola@gmail.com',
        password: '12345'
      } 
    })
    wrapper.find('button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).to.include('Usuario o Contraseña incorrectos, Intente nuevamente.')
    
  })
})
