import axios from 'axios';
import { API_ENDPOINTS } from '../interceptors/apiName';
import { config } from './config';

const uploadFile = async (file:any) => {
  try {
    const data = new FormData();
    data.append('file_data', file);

    const configAxios = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${config.apiBaseUrl}${config.apiPath.v0}${API_ENDPOINTS.uploadFile}`,
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    };

    const response = await axios(configAxios);
    console.log('response :>> ', response);
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export default uploadFile;
