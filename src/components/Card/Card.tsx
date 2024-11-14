import "./Card.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getPromptData, updateInput } from "../../state/prompt/promptSlice";
import { ReactNode } from "react";

interface CardInterface {
  input: string;
  icon: ReactNode;
}

const Card = ({ input, icon }: CardInterface) => {
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      onClick={() => {
        dispatch(
          updateInput({
            input: input,
          })
        );
        dispatch(getPromptData());
      }}
      className="card"
      style={{
        backgroundColor: theme.mode === "dark" ? "#1E1F20" : "#f0f4f9",
      }}
    >
      <p
        style={{
          color: theme.mode === "dark" ? "#CACCCE" : "#585858",
        }}
      >
        {input}
      </p>
      {icon}
    </div>
  );
};

export default Card;
