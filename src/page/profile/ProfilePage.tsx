import React from 'react'
import { useParams } from 'react-router-dom'

export default function ProfilePage() {
    const params : any = useParams()
    const {profileId} = params
  return (
    <div>ProfilePage id is {profileId}</div>
  )
}
