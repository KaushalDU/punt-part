


import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedFontFamily, setSelectedFontFamily] = useState('Rasa');
  const [selectedFontWeight, setSelectedFontWeight] = useState('300');
  const [isItalicChecked, setIsItalicChecked] = useState(false);
  const [editorText, setEditorText] = useState('');
  const [fontsData, setFontsData] = useState({});
  const [fontWeightOptions, setFontWeightOptions] = useState([]);



  useEffect(() => {
    // Fetch Fonts API
    fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyA_jBLmXkGUm74L05we4yD73feZrMCGEF0')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response not ok');
        }
        return response.json();
      })
      .then(data => {
        const fonts = data.items.reduce((acc, font) => {
          acc[font.family] = font.variants;
          return acc;
        }, {});
        setFontsData(fonts);
        // Set initial available weights for the default font
        setFontWeightOptions(fonts['Rasa'] || []);
      })
      .catch(error => {
        console.error('Fetching fonts failed:', error);
      });
  }, []);

  useEffect(() => {
    // Load text and font settings from local storage on component mount
    const savedEditorText = localStorage.getItem('editorText');
    const savedFontFamily = localStorage.getItem('selectedFontFamily');
    const savedFontWeight = localStorage.getItem('selectedFontWeight');
    const savedIsItalicChecked = localStorage.getItem('isItalicChecked') === 'true';

    if (savedEditorText) {
      setEditorText(savedEditorText);
    }
    if (savedFontFamily) {
      setSelectedFontFamily(savedFontFamily);
    }
    if (savedFontWeight) {
      setSelectedFontWeight(savedFontWeight);
    }
    setIsItalicChecked(savedIsItalicChecked);
  }, []);

  useEffect(() => {
    // Save text and font settings to local storage whenever they change
    localStorage.setItem('editorText', editorText);
    localStorage.setItem('selectedFontFamily', selectedFontFamily);
    localStorage.setItem('selectedFontWeight', selectedFontWeight);
    localStorage.setItem('isItalicChecked', isItalicChecked);
  }, [editorText, selectedFontFamily, selectedFontWeight, isItalicChecked]);

  useEffect(() => {
    // Load the selected font dynamically
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFontFamily.replace(/ /g, '+')}:wght@${selectedFontWeight}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup: remove the previous font link to avoid unnecessary requests
    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFontFamily, selectedFontWeight]);

  useEffect(() => {
    // Update font weights when font family changes
    if (fontsData[selectedFontFamily]) {
      setFontWeightOptions(fontsData[selectedFontFamily]);
      // Set default weight to the first available weight if the current weight is not 
      if (!fontsData[selectedFontFamily].includes(selectedFontWeight)) {
        setSelectedFontWeight(fontsData[selectedFontFamily][0]);
      }
    }
  }, [selectedFontFamily, fontsData]);

  const handleFontFamilyChange = (event) => {
    setSelectedFontFamily(event.target.value);
  };

  const handleFontWeightChange = (event) => {
    setSelectedFontWeight(event.target.value);
  };

  const handleItalicChange = () => {
    setIsItalicChecked(!isItalicChecked);
  };

  const handleTextChange = (event) => {
    setEditorText(event.target.value);
  };

  const handleReset = () => {
    setEditorText('');
    setSelectedFontFamily('Rasa');
    setSelectedFontWeight('300');
    setIsItalicChecked(false);
  };

  const handleSave = () => {
    // Handle saving the text to a file 
    console.log('Saving text:', editorText);
  };

  // Generate font family options from Fonts API
  const fontFamilyOptions = Object.keys(fontsData).map((font) => (
    <option key={font} value={font}>
      {font}
    </option>
  ));

  // Generate font weight options based on selected font family
  const fontWeightOptionsElements = fontWeightOptions.map((variant) => (
    <option key={variant} value={variant}>
      {variant}
    </option>
  ));

  return (
    <div className="container">
      <div className="controls">
        <div className="control-group">
          <label htmlFor="font-family">Font Family:</label>
          <select id="font-family" value={selectedFontFamily} onChange={handleFontFamilyChange}>
            {fontFamilyOptions}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="font-weight">Font Weight:</label>
          <select id="font-weight" value={selectedFontWeight} onChange={handleFontWeightChange}>
            {fontWeightOptionsElements}
          </select>
        </div>
        <div className="control-group">
          <label htmlFor="italic">Italic:</label>
          <input
            type="checkbox"
            id="italic"
            checked={isItalicChecked}
            onChange={handleItalicChange}
          />
        </div>
      </div>
      <div className="editor">
        <textarea
          className="textarea"
          value={editorText}
          onChange={handleTextChange}
          style={{
            fontFamily: selectedFontFamily,
            fontWeight: selectedFontWeight,
            fontStyle: isItalicChecked ? 'italic' : 'normal',
          }}
        />
      </div>
      <div className="buttons">
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default App;
