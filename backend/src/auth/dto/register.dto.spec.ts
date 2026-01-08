import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('acepta teléfono con +51 válido', async () => {
    const dto = new RegisterDto();
    dto.email = 'a@b.com';
    dto.password = 'secret123';
    dto.fullName = 'Test';
    dto.phone = '+51 987654321';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rechaza teléfono sin +51', async () => {
    const dto = new RegisterDto();
    dto.email = 'a@b.com';
    dto.password = 'secret123';
    dto.fullName = 'Test';
    dto.phone = '+52 987654321';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'phone')).toBe(true);
  });
});
