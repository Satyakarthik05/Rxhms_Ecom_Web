import { BeseAxios } from "../../../web-constants/constants";

const ourTeamService = async () => {
  try {
    const response = await BeseAxios.get(``, {
      params: {
        channelId: 1,
      },
    });
    console.log("response.data in menu ", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export default ourTeamService;
