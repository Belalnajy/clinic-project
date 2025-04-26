import os
import json
import logging
from typing import Dict, List, Optional
import numpy as np
from PIL import Image
import pytesseract
from openai import OpenAI
from django.conf import settings

logger = logging.getLogger(__name__)

class MedicalAnalysis:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_KEY"))
        self.medical_terms = self._load_medical_terms()
        
    def _load_medical_terms(self) -> Dict:
        """Load medical terminology database"""
        try:
            with open('backend/chatbot/data/medical_terms.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error loading medical terms: {str(e)}")
            return {}

    def analyze_medical_report(self, text: str) -> Dict:
        """Analyze medical report text and extract key information"""
        try:
            prompt = f"""
            Analyze this medical report and extract the following information:
            - Patient's condition
            - Key findings
            - Recommended treatments
            - Follow-up requirements
            
            Report text:
            {text}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a medical report analysis assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            return {
                "success": True,
                "analysis": response.choices[0].message.content
            }
        except Exception as e:
            logger.error(f"Error analyzing medical report: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def process_medical_image(self, image_path: str) -> Dict:
        """Process medical images (X-rays, scans, etc.)"""
        try:
            # Validate image exists
            if not os.path.exists(image_path):
                return {
                    "success": False,
                    "error": "Image file not found",
                    "error_type": "file_missing"
                }

            # Open and validate image
            try:
                image = Image.open(image_path)
                image.verify()  # Verify it's a valid image
            except Exception as e:
                return {
                    "success": False,
                    "error": "Invalid or corrupted image file",
                    "error_type": "invalid_image",
                    "details": str(e)
                }

            # Extract text from image using OCR
            try:
                text = pytesseract.image_to_string(image)
            except Exception as e:
                return {
                    "success": False,
                    "error": "Failed to extract text from image",
                    "error_type": "ocr_failed",
                    "details": str(e)
                }

            # If no text was extracted, return early
            if not text.strip():
                return {
                    "success": False,
                    "error": "No readable text found in the image",
                    "error_type": "no_text"
                }
            
            # Analyze the extracted text
            analysis = self.analyze_medical_report(text)
            
            if not analysis["success"]:
                return {
                    "success": False,
                    "error": "Failed to analyze extracted text",
                    "error_type": "analysis_failed",
                    "details": analysis.get("error")
                }

            # Get image metadata
            metadata = {
                "format": image.format,
                "size": image.size,
                "mode": image.mode
            }
            
            return {
                "success": True,
                "text": text,
                "analysis": analysis["analysis"],
                "metadata": metadata,
                "image_type": "medical" if any(term in text.lower() for term in self.medical_terms) else "unknown"
            }
        except Exception as e:
            logger.error(f"Error processing medical image: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "error_type": "general_error"
            }

    def generate_medical_visualization(self, data: Dict) -> Dict:
        """Generate medical data visualizations"""
        try:
            prompt = f"""
            Create a detailed medical visualization based on this data:
            {json.dumps(data, indent=2)}
            
            The visualization should be:
            - Clear and professional
            - Include relevant medical terminology
            - Show key metrics and trends
            """
            
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            
            return {
                "success": True,
                "url": response.data[0].url,
                "revised_prompt": response.data[0].revised_prompt
            }
        except Exception as e:
            logger.error(f"Error generating medical visualization: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }

    def summarize_medical_data(self, data: List[Dict]) -> Dict:
        """Summarize medical data and trends"""
        try:
            prompt = f"""
            Summarize this medical data, highlighting:
            - Key trends and patterns
            - Significant changes
            - Areas of concern
            - Recommended actions
            
            Data:
            {json.dumps(data, indent=2)}
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a medical data analysis assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            return {
                "success": True,
                "summary": response.choices[0].message.content
            }
        except Exception as e:
            logger.error(f"Error summarizing medical data: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            } 