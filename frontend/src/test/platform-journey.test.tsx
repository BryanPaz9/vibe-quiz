import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlatformJourney } from '@/shared/components';

describe('PlatformJourney', () => {
  it('renders the administrator profile and its first step initially', () => {
    render(<PlatformJourney />);

    expect(
      screen.getByRole('button', { name: 'Administrador' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Participante' }),
    ).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('heading', { name: 'Crea' })).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
  });

  it('switches profiles and resets the active step', async () => {
    const user = userEvent.setup();
    render(<PlatformJourney />);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(
      await screen.findByRole('heading', { name: 'Publica y comparte' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Participante' }));

    expect(
      await screen.findByRole('heading', { name: 'Ingresa con un alias' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Paso 1 de 3')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Participante' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  });

  it('navigates with previous, next and direct step controls', async () => {
    const user = userEvent.setup();
    render(<PlatformJourney />);

    await user.click(screen.getByRole('button', { name: 'Siguiente' }));
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(
      await screen.findByRole('heading', { name: 'Analiza resultados' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(
      await screen.findByRole('heading', { name: 'Publica y comparte' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Crea' }));
    expect(
      await screen.findByRole('heading', { name: 'Crea' }),
    ).toBeInTheDocument();
  });

  it('exposes accessible selected states and causes no network requests', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<PlatformJourney />);

    const secondStep = screen.getByRole('tab', {
      name: 'Publica y comparte',
    });
    expect(secondStep).toHaveAttribute('aria-selected', 'false');

    await user.click(secondStep);
    await waitFor(() =>
      expect(secondStep).toHaveAttribute('aria-selected', 'true'),
    );
    expect(fetchSpy).not.toHaveBeenCalled();

    fetchSpy.mockRestore();
  });

  it('supports keyboard navigation between direct step controls', async () => {
    const user = userEvent.setup();
    render(<PlatformJourney />);

    const firstStep = screen.getByRole('tab', { name: 'Crea' });
    firstStep.focus();
    await user.keyboard('{ArrowRight}');

    const secondStep = screen.getByRole('tab', {
      name: 'Publica y comparte',
    });
    expect(secondStep).toHaveFocus();
    expect(secondStep).toHaveAttribute('aria-selected', 'true');
    expect(
      await screen.findByRole('heading', { name: 'Publica y comparte' }),
    ).toBeInTheDocument();
  });
});
