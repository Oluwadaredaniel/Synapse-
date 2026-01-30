import { Request, Response } from 'express';
import Country from '../models/Country';
import School from '../models/School';

// --- Public Endpoints ---

export const getCountries = async (req: any, res: any) => {
  try {
    const countries = await Country.find({}).sort({ name: 1 });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching countries' });
  }
};

export const getSchoolsByCountry = async (req: any, res: any) => {
  try {
    const { countryName } = req.params;
    const schools = await School.find({ country: countryName }).sort({ name: 1 });
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schools' });
  }
};

// --- Admin Endpoints ---

export const addCountry = async (req: any, res: any) => {
  try {
    const { name, code, flag } = req.body;
    const country = await Country.create({ name, code, flag });
    res.status(201).json(country);
  } catch (error) {
    res.status(400).json({ message: 'Error creating country' });
  }
};

export const addSchool = async (req: any, res: any) => {
  try {
    const { name, countryName } = req.body;
    const school = await School.create({ name, country: countryName });
    res.status(201).json(school);
  } catch (error) {
    res.status(400).json({ message: 'Error creating school' });
  }
};