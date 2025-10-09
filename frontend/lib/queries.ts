import groq from 'groq'

export const personalInfoQuery = groq`*[_type == "personalInfo"][0]{
  name,
  title,
  email,
  phone,
  linkedin,
  github,
  location,
  summary,
}`

export const projectsQuery = groq`*[_type == "project"] | order(order asc){
  _id,
  title,
  'slug': slug.current,
  summary,
  techStack,
  githubUrl,
  liveDemoUrl,
  category,
  featured,
  order
}`

export const experienceQuery = groq`*[_type == "experience"] | order(order asc){
  company,
  position,
  location,
  startDate,
  endDate,
  isCurrent,
  achievements,
  skills
}`

export const educationQuery = groq`*[_type == "education"] | order(order asc){
  institution,
  degree,
  field,
  location,
  startDate,
  endDate,
  isCurrent,
  achievements
}`

export const skillsQuery = groq`*[_type == "skill"] | order(order asc){
  name,
  category,
  proficiency,
  order
}`



