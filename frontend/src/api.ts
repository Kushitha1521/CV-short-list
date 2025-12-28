import axios from "axios";

export const shortlistCVs = async (job: string, files: File[]) => {
  const data = new FormData();
  data.append("job_description", job);
  files.forEach(file => data.append("cvs", file));

  return axios.post("https://kushitha-cv-shortlist.hf.space/shortlist", data);
};
