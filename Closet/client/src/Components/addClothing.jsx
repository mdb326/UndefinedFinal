import { useState } from 'react'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Stack, MenuItem, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'gray',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function AddClothing() {
  const [modalOpen, setModalOpen] = useState(false)

  const [name, setName] = useState('')
  const [weatherType, setWeatherType] = useState('')
  const [clothingType, setClothingType] = useState('')
  const [savedForDay, setSavedForDay] = useState(null)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)

    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const addClothing = () => {
    const formData = new FormData()

    formData.append('user_id', 1) // replace later with auth
    formData.append('name', name)
    formData.append('weather_type', weatherType)
    formData.append('clothing_type', clothingType)
    if (savedForDay) {
      formData.append('saved_for_day', savedForDay.format('YYYY-MM-DD'))
    }

    if (image) {
      formData.append('image', image)
    }

    fetch('http://localhost:3000/clothing', {
      method: 'POST',
      body: formData // ⚠️ DO NOT set Content-Type
    })
      .then(res => {
        if (!res.ok) throw new Error('Upload failed')
      })
      .then(() => {
        // reset everything
        setModalOpen(false)
        setName('')
        setWeatherType('')
        setClothingType('')
        setSavedForDay(null)
        setImage(null)
        setPreview(null)
      })
      .catch(err => console.error('ERROR:', err))
  }

  return (
    <>
      <h1>Clothing Manager</h1>
      <Button onClick={handleModalOpen}>+ Add Clothing Item</Button>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={style}>
          <h3>Add Clothing Item</h3>

          <Stack spacing={2}>
            <TextField
              required
              label="Item Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <TextField
              select
              label="Weather Type"
              value={weatherType}
              onChange={e => setWeatherType(e.target.value)}
            >
              <MenuItem value="hot">Hot</MenuItem>
              <MenuItem value="warm">Warm</MenuItem>
              <MenuItem value="cool">Cool</MenuItem>
              <MenuItem value="cold">Cold</MenuItem>
            </TextField>

            <TextField
              select
              label="Clothing Type"
              value={clothingType}
              onChange={e => setClothingType(e.target.value)}
            >
              <MenuItem value="top">Top</MenuItem>
              <MenuItem value="bottom">Bottom</MenuItem>
              <MenuItem value="outerwear">Outerwear</MenuItem>
              <MenuItem value="shoes">Shoes</MenuItem>
              <MenuItem value="accessory">Accessory</MenuItem>
            </TextField>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Saved For Day"
                value={savedForDay}
                onChange={(value) => setSavedForDay(value)}  
              />
            </LocalizationProvider>

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </Stack>

          <Button onClick={addClothing}>Add Item</Button>
          <Button onClick={handleModalClose}>Close</Button>
        </Box>
      </Modal>
    </>
  )
}

export default AddClothing