import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { commerce } from '../../lib/commerce';
import FormInput from './Checkout/FormInput';

function AddressForm({ checkoutToken, nextStep }) {
  const [shippingCountries, setShippingCountries] = useState([])
  const [shippingCountry, setShippingCountry] = useState('')
  const [shippingSubbdevisions, setShippingSubdivisions] = useState([])
  const [shippingSubbdevision, setShippingSubdivision] = useState('')
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingOption, setShippingOption] = useState('')

  //We make array from object with countries, for ability of maping them, it`s will be look like [{id:'UK', label:'Ukraine'}]
  const countries = Object.entries(shippingCountries).map(([code, name]) => (
    { id: code, label: name }
  ))

  const subdivisions = Object.entries(shippingSubbdevisions).map(([code, name]) => (
    { id: code, label: name }
  ))

  const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }))

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)
    setShippingCountries(countries)

    //get first country from object with the name of the countries
    setShippingCountry(Object.keys(countries)[0])
  }

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })
    setShippingOptions(options)
    setShippingOption(options[0].id)
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)
  }, [])

  // We shod use another useEffect , because we dont have country, so we should call it affter we know shipping countries
  useEffect(() => {
    // if it exist
    if (shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    // if it exist
    if (shippingSubbdevision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubbdevision)
  }, [shippingSubbdevision]);

  const methods = useForm()
  return (
    <>
      <Typography variant='h6' gutterBottom>Shipping Address</Typography>
      <FormProvider {...methods}>
        {/* We are spreading our data, because simple data will have only value of 6 inputs, but we also have 3 selects which we managed with use state, so we should spread data */}
        {/* We are passing all necessary data to nextStep() function */}
        <form onSubmit={methods.handleSubmit((data) => nextStep({...data, shippingCountry, shippingSubbdevision, shippingOption}))}>
          <Grid container spacing={3}>
            <FormInput name='firstName' label='First Name' />
            <FormInput name='lastName' label='Last Name' />
            <FormInput name='address' label='Address' />
            <FormInput name='email' label='Email' />
            <FormInput name='city' label='City' />
            <FormInput name='zip' label='ZIP / Postal code' />
            <Grid item xs={12} sm={6}>
              {/* Here we put all of our shipping countries into the select. It was made for users could choose his country */}
              <InputLabel>Shipping Country</InputLabel>
              <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                {countries.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {/* Here we put all of countries region to this select, so when we choose the country this select fetch the region of this country (Mykolaiv oblast, Kyiv...) */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Subddivision</InputLabel>
              <Select value={shippingSubbdevision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel>Shipping Options</InputLabel>
              <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((opt) => (
                  <MenuItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          <div style={{display:'flex', justifyContent: 'space-between'}}>
                  <Button component={Link} to='/cart' variant='outlined'>Bac to cart</Button>
                  <Button type='submit' variant='contained' color='primary'>Next</Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default AddressForm