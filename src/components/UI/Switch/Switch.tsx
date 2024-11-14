import { alpha, styled } from "@mui/material/styles";
import { pink } from "@mui/material/colors";
import MuiSwitch from "@mui/material/Switch";
import { updateTheme, updateSwitch } from "../../../state/theme/themeSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";

const PinkSwitch = styled(MuiSwitch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: pink[600],
    "&:hover": {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: pink[600],
  },
}));

export default function Switch() {
  const dispatch = useDispatch<AppDispatch>();
  const switchChecked = useSelector(
    (state: RootState) => state.theme.switchChecked
  );

  const handleSwitchChange = () => {
    const newChecked = !switchChecked;
    dispatch(updateSwitch(newChecked));
    if (newChecked) {
      dispatch(updateTheme("dark"));
    } else {
      dispatch(updateTheme("light"));
    }
  };

  return (
    <div>
      <PinkSwitch checked={switchChecked} onChange={handleSwitchChange} />
    </div>
  );
}
