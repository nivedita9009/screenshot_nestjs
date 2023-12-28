import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Grid,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const ScreenshotTool = () => {
  const [url, setUrl] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [screenshots, setScreenshots] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({
    desktop: false,
    mobile: false,
    tab: false,
  });
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleScriptNameChange = (e) => {
    // Assuming e.target.value contains the dynamic image URL
    const dynamicImageUrl = e.target.value;
    const iframeTag = dynamicImageUrl;
    setScriptName(iframeTag);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSizes) => ({
      ...prevSizes,
      [size]: !prevSizes[size],
    }));
  };

  const handleCaptureButtonClick = async () => {
    try {
      setLoading(true);

      const selectedSizesList = Object.entries(selectedSizes)
        .filter(([size, isSelected]) => isSelected)
        .map(([size]) => size);

      const screenshotData = await Promise.all(
        selectedSizesList.map(async (size) => {
          const response = await fetch(
            `http://localhost:4000/api/screenshot?url=${encodeURIComponent(
              url
            )}&size=${size}&script=${encodeURIComponent(scriptName)}`
          );
          const data = await response.json();

          if (response.ok) {
            return { size, screenshot: data.screenshot };
          } else {
            throw new Error(data.error || "Failed to capture screenshot");
          }
        })
      );

      setScreenshots((prevScreenshots) => [
        ...prevScreenshots,
        ...screenshotData,
      ]);
      setError(null);
    } catch (error) {
      console.error("Error capturing screenshots:", error);
      setError("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div elevation={3} style={{ padding: 64, margin: 16 }}>
      <Typography variant="h3">Screenshot Tool</Typography>
      <TextField
        type="url"
        value={url}
        onChange={handleUrlChange}
        label="Enter URL"
        fullWidth
        margin="normal"
      />
      <TextField
        value={scriptName}
        onChange={handleScriptNameChange}
        label="Scripts (include iframe tag with dynamic img src)"
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />

      <FormControl component="fieldset" fullWidth margin="normal">
        <FormLabel component="legend">Select Sizes</FormLabel>
        <FormGroup style={{ display: "flex", flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSizes.desktop}
                onChange={() => handleSizeChange("desktop")}
              />
            }
            label="Desktop"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSizes.mobile}
                onChange={() => handleSizeChange("mobile")}
              />
            }
            label="Mobile"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedSizes.tab}
                onChange={() => handleSizeChange("tab")}
              />
            }
            label="Tab"
          />
        </FormGroup>
      </FormControl>

      <Button
        variant="contained"
        onClick={handleCaptureButtonClick}
        style={{ marginTop: 16 }}
        disabled={loading}
      >
        Capture Screenshots
      </Button>

      {error && <div>Error: {error}</div>}

      <Backdrop open={loading} style={{ zIndex: 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Backdrop open={loading} style={{ zIndex: 1, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={2} style={{ marginTop: 16 }}>
        {screenshots.map((screenshot, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Typography variant="h6" style={{ marginBottom: 8 }}>
              {screenshot.size}
            </Typography>
            <Paper elevation={3} style={{ padding: 16 }}>
              <img
                src={`data:image/png;base64,${screenshot.screenshot}`}
                alt={`Screenshot ${index + 1}`}
                style={{ width: "100%" }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ScreenshotTool;
