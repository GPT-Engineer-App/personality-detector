import React, { useState } from "react";
import { Container, Text, VStack, Input, Button, Select, Box, Spinner, useToast } from "@chakra-ui/react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Detect Personality": "Detect Personality",
        "Enter text": "Enter text",
        Language: "Language",
        Analyze: "Analyze",
        "Listening...": "Listening...",
        Stop: "Stop",
        "Detected Personality": "Detected Personality",
        Error: "Error",
        "Please enter text or use the microphone to speak.": "Please enter text or use the microphone to speak.",
      },
    },
    es: {
      translation: {
        "Detect Personality": "Detectar Personalidad",
        "Enter text": "Ingrese texto",
        Language: "Idioma",
        Analyze: "Analizar",
        "Listening...": "Escuchando...",
        Stop: "Detener",
        "Detected Personality": "Personalidad Detectada",
        Error: "Error",
        "Please enter text or use the microphone to speak.": "Por favor ingrese texto o use el micrófono para hablar.",
      },
    },
    // Add more languages here
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const Index = () => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleAnalyze = async () => {
    if (!text && !transcript) {
      toast({
        title: t("Error"),
        description: t("Please enter text or use the microphone to speak."),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("YOUR_PERSONALITY_API_ENDPOINT", {
        text: text || transcript,
        language,
      });
      setResult(response.data);
    } catch (error) {
      toast({
        title: t("Error"),
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  const handleMicrophoneClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">{t("Detect Personality")}</Text>
        <Input placeholder={t("Enter text")} value={text} onChange={(e) => setText(e.target.value)} />
        <Select value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="es">Español</option>
          {/* Add more languages here */}
        </Select>
        <Button onClick={handleAnalyze} isLoading={loading}>
          {t("Analyze")}
        </Button>
        <Button leftIcon={listening ? <FaStop /> : <FaMicrophone />} onClick={handleMicrophoneClick}>
          {listening ? t("Stop") : t("Listening...")}
        </Button>
        {loading && <Spinner />}
        {result && (
          <Box p={4} borderWidth="1px" borderRadius="lg" width="100%">
            <Text fontSize="lg">{t("Detected Personality")}</Text>
            <Text>{result.personality}</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
