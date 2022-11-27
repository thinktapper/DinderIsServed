import axios from 'axios'
import prisma from '../db'
import type { Request, Response, NextFunction } from 'express'
import type { Place, Prisma } from '@prisma/client'

const GOOGLE_API = process.env.GOOGLE_API

// type Place = {
//   name: string
//   googleId: string
//   price?: string
//   description?: string
//   rating?: string
//   ratingsTotal?: string
//   stars?: string
//   photos: string[]
// }
// type Feast = {
//   id: string
//   name: string
//   location: Prisma.JsonObject
//   radius: number
// }

export const fetchPlaces = async ({ feast }) => {
  const { location, radius } = feast
  const feastId = feast.id
  const { lat, long } = location
  const distance = radius * 1609.34
  const googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place'
  const searchUrl = `${googlePlacesBaseUrl}/textsearch/json?query=restaurants&locationbias=circle%3A${distance}%40${lat}%2C${long}&key=${GOOGLE_API}`
  const fields =
    'name,place_id,rating,user_ratings_total,price_level,photos,editorial_summary'
  const extraFields =
    'opening_hours,formatted_address,formatted_phone_number,website'

  // fetch data from Google Maps API
  try {
    const { data } = await axios.get(searchUrl)
    // const data = await res.json()
    const { status, results } = data

    let arrPlaceDetails = []
    if (status === 'OK') {
      let fetchedPlaces = []

      // get place details for each place
      // @ts-ignore
      // for (let result of results) {
      //   arrPlaceDetails.push(
      //     axios.get(
      //       `${googlePlacesBaseUrl}/details/json?place_id=${result.place_id}&fields=${fields}&key=${GOOGLE_API}`,
      //     ),
      //   )
      // }
      results.forEach((result: { place_id: any }) => {
        arrPlaceDetails.push(
          axios.get(
            `${googlePlacesBaseUrl}/details/json?place_id=${result.place_id}&fields=${fields}&key=${GOOGLE_API}`,
          ),
        )
      })

      const arrDetailsResults = await Promise.all(arrPlaceDetails)

      // for (let pr of arrDetailsResults) {
      // let data = await pr.json()
      arrDetailsResults.forEach(async (pr) => {
        let googlePlace = pr.data.result
        // let place = {}
        let gallery = await googlePlace.photos?.map(
          (photo) =>
            `${googlePlacesBaseUrl}/photo?maxwidth=600&photoreference=${photo.photo_reference}&key=${GOOGLE_API}`,
        )
        let summary = googlePlace.editorial_summary
          ? googlePlace.editorial_summary.overview
          : 'No description available'
        // Transform price level to dollar signs
        let pl = ''
        if (googlePlace.price_level) {
          for (let i = 0; i < googlePlace.price_level; i++) {
            pl += '$'
          }
        } else {
          pl = 'Price N/A'
        }
        // Transform rating to stars
        let starRating = ''
        if (googlePlace.rating) {
          for (let i = 0; i < googlePlace.rating; i++) {
            starRating += '★'
          }
        }
        let place = {
          googleId: googlePlace.place_id,
          name: googlePlace.name,
          price: pl.toString(),
          rating: googlePlace.rating.toString() || 'No ratings',
          ratingsTotal: googlePlace.user_ratings_total.toString() || 'N/A',
          stars: starRating.toString(),
          photos: gallery,
          description: summary,
        }

        await prisma.place.create({
          data: {
            ...place,
            feast: {
              connect: {
                id: feastId,
              },
            },
          },
        })

        // await prisma.place.create({
        //   data: {
        //     name: place.name,
        //     googleId: place.googleId,
        //     price: place.price,
        //     rating: place.rating,
        //     ratingsTotal: place.ratingsTotal,
        //     stars: place.stars,
        //     photos: place.photos,
        //     description: place.description,
        //     feast: {
        //       connect: {
        //         id: feastId,
        //       },
        //     },
        //   },
        // })

        fetchedPlaces.push(place)
      })
      return fetchedPlaces

      // res.status(200).json({ data: feast, places: fetchedPlaces })
    }
  } catch (error) {
    console.error(`Error fetching places from Google: ${error}`)
    // next(error)
    throw new Error(error)
  }
}
