import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import sinon from 'sinon'
import dummyStore from './mocks/store'// store falso para hacer pruebas
import vuex from 'vuex'
import Products from '@/components/Products.vue'

const localVue = createLocalVue()// localvue permite cargar plugin
localVue.use(vuex)// permite cargar plugin  vuex
const store = new vuex.Store(dummyStore)// se genera el store dummy

describe('Products.vue', () => {
  it('Muestra el titulo "Nuestros Productos"', () => {
    const title = 'Nuestros Productos'
    const wrapper = shallowMount(Products, {})
    expect(wrapper.find('h1').text()).to.include(title)
  }),
  it('Muestra los productos', () => {
    const productName = 'Computadora'
    const wrapper = shallowMount(Products, {
      data(){
        return {
            products: [{
            name: 'Computadora',
            price: 100.0,
            qty: 1,
          }]
        }
      }
    })
   expect(wrapper.text()).to.include(productName)
  }),
  it('Filtra los productos independiente de mayusculas y minusculas', () => {
    const productSearch = 'computadora'
    const wrapper = shallowMount(Products, {})
    const searchBox = wrapper.find('input')
    wrapper.vm.products = [{
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }]
    searchBox.setValue('teclado')
    expect(wrapper.text()).to.not.include(productSearch)
    searchBox.setValue(productSearch)
    expect(wrapper.text()).to.include('Computadora')
  }),
  it('Añade los productos al carro', () => {
    const wrapper = shallowMount(Products, {})
    const clickMethodStub = sinon.stub()
    const product = {
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }
    wrapper.vm.products = [product]
    wrapper.setMethods({
      addToCart: clickMethodStub
    })
    const addButton = wrapper.find('.card .button')
    addButton.trigger('click')
    expect(clickMethodStub.calledWith(product)).to.equal(true)
  }),
  it('Añade los productos al store', () => {
    const wrapper = shallowMount(Products, {localVue, store})
    const product = {
      name: 'Computadora',
      price: 100.0,
      qty: 1,
    }
    wrapper.vm.products = [product]// vm = vue model
    const addButton = wrapper.find('.card .button')
    addButton.trigger('click')

    expect(store.state.shoppingCart.list.length).to.equal(1)
    expect(store.state.shoppingCart.total).to.equal(100.0)

  })
})
