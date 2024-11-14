import "./SideBar.scss";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import {
  getRecentPrompt,
  cancelShowResult,
  approveShowResult,
  updateLoading,
  updateActiveRecentPrompt,
  RecentPromptInterface,
  deleteRecentPrompt,
  togglePinRecentPrompt,
} from "../../state/prompt/promptSlice";
import Switch from "../UI/Switch/Switch";
import Popover from "@mui/material/Popover";

//ICONS
import { FiHelpCircle, FiSettings, FiPlus, FiMenu } from "react-icons/fi";
import { RiHistoryFill } from "react-icons/ri";
import { IoIosClose } from "react-icons/io";
import { MdOutlineDarkMode } from "react-icons/md";
import { BiMessage } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { MdPushPin } from "react-icons/md";
import { RiUnpinFill } from "react-icons/ri";

const SideBar = () => {
  const [extended, setExtended] = useState<boolean>(false);
  const [openPopup, setOpenPopup] = useState<null | "help" | "settings">(null);
  const [selectedRecentPromptId, setSelectedRecentPromptId] =
    useState<number>(0);

  const prompt = useSelector((state: RootState) => state.prompt);
  const theme = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch<AppDispatch>();

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside =
        modalRef.current !== null && !modalRef.current.contains(target);

      if (isOutside) {
        setOpenPopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getRecent = (recentPrompt: RecentPromptInterface) => {
    dispatch(approveShowResult());
    dispatch(getRecentPrompt({ id: recentPrompt.id }));
    dispatch(updateActiveRecentPrompt({ id: recentPrompt.id }));
    dispatch(updateLoading(true));
    setTimeout(() => {
      dispatch(updateLoading(false));
    }, 700);
  };

  const handleMenuClick = () => {
    setExtended((prev) => !prev);
  };

  const handleSettingsClick = () => {
    setOpenPopup((prev) => (prev === "settings" ? null : "settings"));
  };

  const handleHelpClick = () => {
    setOpenPopup((prev) => (prev === "help" ? null : "help"));
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOptionsClick = (
    recentPromptId: number,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setSelectedRecentPromptId(recentPromptId);
    setAnchorEl(event.currentTarget);
  };

  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const optionsOpen = Boolean(anchorEl);
  const optionsId = optionsOpen ? "recent-options-popover" : undefined;

  return (
    <div
      style={{ backgroundColor: theme.mode === "dark" ? "#1E1F20" : "#f0f4f9" }}
      className={`sidebar ${extended ? "expanded" : ""}`}
    >
      <div className="top">
        <div
          onClick={handleMenuClick}
          className={`menu ${theme.mode === "dark" ? "dark-mode" : ""}`}
        >
          <FiMenu
            size={20}
            color={theme.mode === "dark" ? "#fff" : "initial"}
          />
        </div>

        <div
          onClick={() => dispatch(cancelShowResult())}
          style={{
            opacity: prompt.showResult ? "1" : "0.7",
            pointerEvents: prompt.showResult ? "auto" : "none",
            fontWeight: prompt.showResult ? "600" : "400",
            backgroundColor: theme.mode === "dark" ? "#000" : "#e6eaf1",
          }}
          className="new-chat"
        >
          <FiPlus
            size={20}
            color={theme.mode === "dark" ? "#fff" : "initial"}
          />
          {extended && (
            <p style={{ color: theme.mode === "dark" ? "#DDDADD" : "initial" }}>
              New chat
            </p>
          )}
        </div>
        <div className="recent">
          {extended && (
            <>
              {prompt.recentPrompts.length ? (
                <div className="recent-container">
                  <RiHistoryFill
                    size={20}
                    color={theme.mode === "dark" ? "#fff" : "initial"}
                  />
                  <p
                    style={{
                      color: theme.mode === "dark" ? "#DDDADD" : "initial",
                      userSelect: "none",
                    }}
                    className="recent-title"
                  >
                    No recent
                  </p>
                </div>
              ) : (
                <div className="recent-container">
                  <RiHistoryFill
                    size={20}
                    color={theme.mode === "dark" ? "#fff" : "initial"}
                  />
                  <p
                    style={{
                      color: theme.mode === "dark" ? "#DDDADD" : "initial",
                      userSelect: "none",
                    }}
                    className="recent-title"
                  >
                    No recent
                  </p>
                </div>
              )}
              {prompt.recentPrompts.map((recentPrompt) => {
                return (
                  <div
                    onClick={() => {
                      if (recentPrompt.id !== prompt.activeId) {
                        getRecent(recentPrompt);
                      }
                    }}
                    className={`recent-entry ${
                      recentPrompt.id === prompt.activeId ? "active" : ""
                    } ${recentPrompt.isPinned ? "pinned" : ""} ${
                      theme.mode === "dark" ? "dark-mode" : ""
                    }`}
                    key={recentPrompt.id}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {recentPrompt.isPinned ? (
                        <MdPushPin
                          size={22}
                          color={theme.mode === "dark" ? "#fff" : "initial"}
                        />
                      ) : (
                        <BiMessage
                          size={22}
                          color={theme.mode === "dark" ? "#fff" : "initial"}
                        />
                      )}

                      <p
                        style={{
                          color: theme.mode === "dark" ? "#DDDADD" : "#282828",
                        }}
                      >{`${
                        recentPrompt.title.length > 10
                          ? recentPrompt.title.slice(0, 10) + "..."
                          : recentPrompt.title
                      }`}</p>
                    </div>

                    <div
                      className="options"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionsClick(recentPrompt.id, e);
                      }}
                    >
                      <BsThreeDotsVertical size={22} />
                    </div>
                    <Popover
                      id={optionsId}
                      open={optionsOpen}
                      anchorEl={anchorEl}
                      onClose={handleOptionsClose}
                      anchorOrigin={{
                        vertical: "center",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <div
                        className="recent-entry-container"
                        style={{
                          width: "130px",
                          backgroundColor:
                            theme.mode === "dark" ? "#1e1f20" : "#f0f4f9",
                        }}
                      >
                        <div
                          className={`recent-entry-option ${
                            theme.mode === "dark" ? "dark-mode" : ""
                          }`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            gap: "10px",
                            padding: "10px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionsClose();
                            dispatch(
                              togglePinRecentPrompt({
                                id: selectedRecentPromptId,
                              })
                            );
                          }}
                        >
                          {prompt.recentPrompts.find(
                            (p) => p.id === selectedRecentPromptId
                          )?.isPinned ? (
                            <RiUnpinFill
                              size={18}
                              color={theme.mode === "dark" ? "#fff" : "initial"}
                            />
                          ) : (
                            <MdPushPin
                              size={18}
                              color={theme.mode === "dark" ? "#fff" : "initial"}
                            />
                          )}

                          <span
                            style={{
                              width: "50px",
                              color: theme.mode === "dark" ? "#fff" : "initial",
                            }}
                          >
                            {prompt.recentPrompts.find(
                              (p) => p.id === selectedRecentPromptId
                            )?.isPinned
                              ? "Unpin"
                              : "Pin"}
                          </span>
                        </div>
                        <div
                          className={`recent-entry-option ${
                            theme.mode === "dark" ? "dark-mode" : ""
                          }`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            gap: "10px",
                            padding: "10px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionsClose();
                            dispatch(
                              deleteRecentPrompt({
                                id: selectedRecentPromptId,
                              })
                            );
                          }}
                        >
                          <MdDelete
                            size={18}
                            color={theme.mode === "dark" ? "#fff" : "initial"}
                          />
                          <span
                            style={{
                              width: "50px",
                              color: theme.mode === "dark" ? "#fff" : "initial",
                            }}
                          >
                            Delete
                          </span>
                        </div>
                      </div>
                    </Popover>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
      <div className={`bottom ${extended ? "extended" : ""}`} ref={modalRef}>
        <div
          className={`bottom-item recent-entry settings ${
            theme.mode === "dark" ? "dark-mode" : ""
          }`}
          onClick={handleHelpClick}
        >
          <FiHelpCircle
            size={20}
            color={theme.mode === "dark" ? "#fff" : "initial"}
          />
          {extended && (
            <p
              style={{
                color: theme.mode === "dark" ? "#DDDADD" : "initial",
              }}
            >
              Help
            </p>
          )}
          {openPopup === "help" && (
            <div
              style={{
                backgroundColor: theme.mode === "dark" ? "#282A2C" : "#fff",
              }}
              className="popup-container"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`close-button ${
                  theme.mode === "dark" ? "dark-mode" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopup(null);
                }}
                style={{
                  backgroundColor: theme.mode === "dark" ? "#000" : "#f0f4f9",
                }}
              >
                <IoIosClose
                  color={theme.mode === "dark" ? "#f0f4f9" : "#000"}
                />
              </div>
              <p
                style={{
                  color: theme.mode === "dark" ? "#DDDADD" : "initial",
                }}
              >
                Enter a prompt to get response
              </p>
            </div>
          )}
        </div>
        <div
          className={`bottom-item recent-entry settings ${
            theme.mode === "dark" ? "dark-mode" : ""
          }`}
          onClick={handleSettingsClick}
        >
          <FiSettings
            size={20}
            color={theme.mode === "dark" ? "#fff" : "initial"}
          />
          {extended && (
            <p
              style={{
                color: theme.mode === "dark" ? "#DDDADD" : "initial",
              }}
            >
              Settings
            </p>
          )}
          {openPopup === "settings" && (
            <div
              style={{
                backgroundColor: theme.mode === "dark" ? "#282A2C" : "#fff",
              }}
              className="popup-container"
              onClick={(e) => e.stopPropagation()}
            >
              <MdOutlineDarkMode
                size={20}
                color={theme.mode === "dark" ? "#fff" : "initial"}
              />
              <div
                className={`close-button ${
                  theme.mode === "dark" ? "dark-mode" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenPopup(null);
                }}
                style={{
                  backgroundColor: theme.mode === "dark" ? "#000" : "#f0f4f9",
                }}
              >
                <IoIosClose
                  color={theme.mode === "dark" ? "#f0f4f9" : "#000"}
                />
              </div>
              <p
                style={{
                  color: theme.mode === "dark" ? "#DDDADD" : "initial",
                }}
              >
                Enable dark mode
              </p>
              <Switch />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
