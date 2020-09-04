
import styled from "styled-components";

import { Styled } from "../../types/styled";

const Input: Styled<> = styled.div`
  display: block;
  outline: none;
  border: none;
  padding: 0;
  border-radius: 15px;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  letter-spacing: 0.8px;
  box-shadow: 0 0 0 0.5px var(--lead);
  width: 100%;
  position: relative;
  background: white;
  display: flex;
  align-items: center;
`;

export default Input;